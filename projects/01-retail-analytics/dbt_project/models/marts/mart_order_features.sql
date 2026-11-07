-- One row per order, with only information that exists at the moment of purchase,
-- plus the delivery outcome kept separately as the label.
--
-- Project 02 predicts `is_late` from this table. The split between features and
-- label is the whole safety property of the model: if a post-purchase column
-- (carrier hand-off, delivery time, review score) ever reaches the feature
-- matrix, the model will learn the answer and the evaluation will look superb
-- while being useless. `late_delivery.features.FEATURES` is an explicit
-- allow-list, and a Python test asserts that no forbidden column is in it.
--
-- The label is therefore present in the table but never selected as a feature.
-- Orders that were never delivered have no label (NULL) and no late flag: they
-- are excluded from training and evaluation, and that exclusion is stated in
-- the report.

with orders as (

    select * from {{ ref('fct_orders') }}

),

-- Item-level attributes, aggregated to one row per order. Joining the item
-- table directly would multiply orders that contain several products.
-- Seller state is only usable when every item shipped from the same state;
-- a multi-state order has no single lane and gets NULL.
items as (

    select
        i.order_id,
        count(*)                                    as item_count,
        count(distinct i.product_id)                as product_count,
        count(distinct i.seller_id)                 as seller_count,
        count(distinct s.state)                     as seller_state_count,
        min(s.state)                                as seller_state,
        avg(p.weight_grams)                         as avg_weight_grams,
        avg(p.length_cm * p.height_cm * p.width_cm) as avg_volume_cm3,
        avg(p.photos_qty)                           as avg_photos_qty,
        count(*) filter (
            where p.weight_grams is null
               or p.length_cm is null
               or p.height_cm is null
               or p.width_cm is null
        )                                           as items_missing_dimensions

    from {{ ref('stg_order_items') }} i
    left join {{ ref('stg_products') }} p on i.product_id = p.product_id
    left join {{ ref('stg_sellers') }} s  on i.seller_id = s.seller_id
    group by i.order_id

),

-- One category per order: the most frequent category among its items. Ties are
-- broken alphabetically so the value is deterministic across rebuilds.
categories as (

    select distinct on (order_id)
        order_id,
        category_name_english as category
    from {{ ref('fct_order_items') }}
    order by order_id, category_name_english

),

payments as (

    select
        order_id,
        count(*)                        as payment_count,
        max(payment_installments)       as max_installments,
        bool_or(payment_type = 'credit_card') as paid_by_credit_card,
        bool_or(payment_type = 'boleto')      as paid_by_boleto,
        bool_or(payment_type = 'voucher')     as paid_by_voucher

    from {{ ref('stg_order_payments') }}
    group by order_id

),

joined as (

    select
        o.order_id,
        o.purchased_at,

        -- Calendar features, all derived from the purchase timestamp.
        extract(month from o.purchased_at)::int        as purchase_month,
        extract(dow from o.purchased_at)::int          as purchase_dow,
        extract(hour from o.purchased_at)::int         as purchase_hour,
        (extract(dow from o.purchased_at) in (0, 6))   as purchase_weekend,

        -- The promise is shown to the customer at checkout, so its length is
        -- known at purchase time. It is also the lever the business controls.
        o.estimated_delivery_at::date - o.purchased_at::date as promise_days,

        o.customer_state,
        -- NULL when the order spans sellers in more than one state.
        case when i.seller_state_count = 1 then i.seller_state end as seller_state,
        case
            when i.seller_state_count = 1 and i.seller_state = o.customer_state then true
            when i.seller_state_count = 1 then false
        end as same_state,

        c.category,
        o.item_count,
        o.product_count,
        o.seller_count,
        o.items_value,
        o.freight_value,
        o.order_value,
        case
            when o.items_value > 0 then o.freight_value / o.items_value
        end as freight_share,

        coalesce(i.avg_weight_grams, 0)          as avg_weight_grams,
        coalesce(i.avg_volume_cm3, 0)            as avg_volume_cm3,
        coalesce(i.avg_photos_qty, 0)            as avg_photos_qty,
        coalesce(i.items_missing_dimensions, 0)  as items_missing_dimensions,

        coalesce(p.payment_count, 0)             as payment_count,
        coalesce(p.max_installments, 1)          as max_installments,
        coalesce(p.paid_by_credit_card, false)   as paid_by_credit_card,
        coalesce(p.paid_by_boleto, false)        as paid_by_boleto,
        coalesce(p.paid_by_voucher, false)       as paid_by_voucher,

        -- The label. NULL means the order was not delivered, which is a
        -- different outcome and must not be treated as on time.
        o.is_late,
        o.days_late

    from orders o
    left join items i     on o.order_id = i.order_id
    left join categories c on o.order_id = c.order_id
    left join payments p  on o.order_id = p.order_id

)

select * from joined

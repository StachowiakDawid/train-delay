-- ltree
-- select c.department_date + o.departments_offsets [index(r.ltree_route, text2ltree($1)) + 1] * interval '1 second' as department_timestamp,
--     c.department_delays [index(r.ltree_route, text2ltree($1)) + 1] as department_delay,
--     c.department_date + o.arrivals_offsets [index(r.ltree_route, text2ltree($2)) + 1] * interval '1 second' as s2_arrival_timestamp,
--     c.arrival_delays [index(r.ltree_route, text2ltree($2)) + 1] as s2_arrival_delay,
--     (c.cancelled[index(r.ltree_route, text2ltree($1)) + 1] or c.cancelled[index(r.ltree_route, text2ltree($2)) + 1]) as cancelled
-- from connection c
--     inner join route r on r.id = c.route_id
--     and r.ltree_route ~ cast($3 as lquery)
--     inner join time_offset o on o.id = c.time_offset_id
-- order by department_timestamp desc;

-- array
select c.department_date + o.departments_offsets [array_position(r.array_route, $1)] * interval '1 second' as department_timestamp,
    c.department_delays [array_position(r.array_route, $1)] as department_delay,
    c.department_date + o.arrivals_offsets [array_position(r.array_route, $2)] * interval '1 second' as s2_arrival_timestamp,
    c.arrival_delays [array_position(r.array_route, $2)] as s2_arrival_delay,
    (c.cancelled[array_position(r.array_route, $1)] OR c.cancelled[array_position(r.array_route, $2)]) as cancelled
from connection c
    inner join route r on r.id = c.route_id
    and r.array_route @> array[$1, $2]::varchar[] AND array_position(r.array_route, $1) < array_position(r.array_route, $2)
    inner join time_offset o on o.id = c.time_offset_id
order by department_timestamp desc;
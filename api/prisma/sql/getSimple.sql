select c.department_date + d.offsets [index(r.ltree_route, text2ltree($1)) + 1] * interval '1 second' as department_timestamp,
    c.department_delays [index(r.ltree_route, text2ltree($1)) + 1] as department_delay,
    c.department_date + a.offsets [index(r.ltree_route, text2ltree($2)) + 1] * interval '1 second' as s2_arrival_timestamp,
    c.arrival_delays [index(r.ltree_route, text2ltree($2)) + 1] as s2_arrival_delay,
    c.cancelled[index(r.ltree_route, text2ltree($2)) + 1] as cancelled
from connection c
    inner join route r on r.id = c.route_id
    and r.ltree_route ~ cast($3 as lquery)
    inner join time_offset a on a.id = c.arrivals_offsets_id
    inner join time_offset d on d.id = c.departments_offsets_id
order by department_timestamp desc;
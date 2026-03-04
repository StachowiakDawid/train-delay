const sql = `
select c.id || '-' || $1 || '-' || $2 as track, 
    c.department_date + o.departments_offsets [array_position(r.array_route, $1)] * interval '1 second' as department_timestamp,
    c.department_delays [array_position(r.array_route, $1)] as department_delay,
    c.department_date + o.arrivals_offsets [array_position(r.array_route, $2)] * interval '1 second' as s2_arrival_timestamp,
    c.arrival_delays [array_position(r.array_route, $2)] as s2_arrival_delay,
    c.cancelled[array_position(r.array_route, $1)] OR c.cancelled[array_position(r.array_route, $2)] as cancelled
from connection c
    inner join route r on r.id = c.route_id
    and r.array_route @> array[$1, $2]::varchar[] AND array_position(r.array_route, $1) < array_position(r.array_route, $2)
    inner join time_offset o on o.id = c.time_offset_id
order by department_timestamp desc;`;

export default sql;

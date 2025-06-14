-- select      s.department_timestamp at time zone 'UTC' at time zone 'Europe/Warsaw' as department_timestamp,
--             s.department_delay,
--             s2.arrival_timestamp at time zone 'UTC' at time zone 'Europe/Warsaw' as s2_arrival_timestamp ,
--             s2.arrival_delay as s2_arrival_delay
--         from stop s
--         inner join stop s2 on s2.connection_id = s.connection_id and s.station_id = $1 and s2.station_id = $2 and s2.order_number > s.order_number
--         order by s.department_timestamp desc;

select s1.department_timestamp at time zone 'UTC' at time zone 'Europe/Warsaw' as department_timestamp,
            s1.department_delay,
            s2.arrival_timestamp at time zone 'UTC' at time zone 'Europe/Warsaw' as s2_arrival_timestamp ,
            s2.arrival_delay as s2_arrival_delay from connection c
inner join route r on r.id = c.route_id and r.ltree_route ~ cast($1 as lquery)
inner join stop s1 on s1.connection_id = c.id and s1.station_id = $2
inner join stop s2 on s2.connection_id = c.id and s2.station_id = $3;
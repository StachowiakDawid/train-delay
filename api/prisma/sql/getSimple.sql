select      s.department_timestamp at time zone 'UTC' at time zone 'Europe/Warsaw' as department_timestamp,
            s.department_delay,
            s2.arrival_timestamp at time zone 'UTC' at time zone 'Europe/Warsaw' as s2_arrival_timestamp ,
            s2.arrival_delay as s2_arrival_delay
        from "Stop" s
        inner join "Stop" s2 on s2.connection_id = s.connection_id and s.station = $1 and s2.station = $2 and s2.order_number > s.order_number
        order by s.department_timestamp desc;
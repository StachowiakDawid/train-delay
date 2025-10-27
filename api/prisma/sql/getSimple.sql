select      s.arrival_timestamp,
            s.department_timestamp,
            s.arrival_delay,
            s.department_delay,
            s2.arrival_timestamp as s2_arrival_timestamp,
            s2.department_timestamp as s2_department_timestamp,
            s2.arrival_delay as s2_arrival_delay,
            s2.department_delay as s2_department_delay
        from "Stop" s
        inner join "Stop" s2 on s2.connection_id = s.connection_id and s.station = $1 and s2.station = $2 and s2.order_number > s.order_number
        order by s.arrival_timestamp desc;
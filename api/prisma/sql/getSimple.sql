select station,
    arrival_timestamp,
    department_timestamp,
    arrival_time,
    department_time,
    arrival_delay,
    department_delay,
    connection_id
from (
        select station,
            arrival_timestamp,
            department_timestamp,
            arrival_time,
            department_time,
            arrival_delay,
            department_delay,
            connection_id,
            ROW_NUMBER () OVER (
                order by s.connection_id,
                    s.order_number ASC
            ) as row_number
        from "Stop" s
        where (
                s.station = $1
                or s.station = $2
            )
            and s.connection_id in (
                select distinct s.connection_id
                from "Stop" s
                where s.station = $1
                intersect
                select distinct s.connection_id
                from "Stop" s
                where s.station = $2
            )
        order by s.connection_id,
            s.order_number asc
    ) s
where (
        row_number %2 = 1
        and s.station = $1
    )
    or (
        row_number %2 = 0
        and s.station = $2
    );
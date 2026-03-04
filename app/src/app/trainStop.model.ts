export interface TrainStop {
    track: string;
    department_timestamp: string;
    department_delay: number;
    s2_arrival_timestamp: string;
    s2_arrival_delay: number;
    cancelled: boolean;
}
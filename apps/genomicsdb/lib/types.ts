export interface APIResponse {
    data: Data[];
    request: Request;
    pagination: Pagination;
    message: string;
};

export interface Data {
};

export interface Request {
    request_id: string;
    endpoint: string;
    parameters: RequestParameters;
};

export interface RequestParameters {
    id: string;
}

export interface Pagination {
    page: number;
    total_num_pages: number;
    paged_num_records: number;
    total_num_records: number;
};

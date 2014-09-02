/**
 * Created by sungwoo on 14. 9. 1.
 */

interface TCriteria {

}

interface Model<T, H extends TCriteria> {
    count(criteria?: any): Model<T, H>;
    create(criteria?: any): Model<T, H>;
    destroy(criteria?: any): Model<T, H>;
    find(criteria?: any): Model<T, H>;
    findOne(criteria: any): Model<T, H>;
    findOrCreate(criteria: any, data: any): Model<T, H>;
    native(criteria?: any): Model<T, H>;
    query(criteria?: any): Model<T, H>;
    stream(criteria?: any): Model<T, H>;
    update(criteria: any, data: any): Model<T, H>;

    // Queries
    exec(cb: (err: any, items: T[]) => void): Model<T, H>;
    exec(cb: (err: any, item: T) => void): Model<T, H>;
    limit(): Model<T, H>;
    populate(field: string): Model<T, H>;
    populateAll(): Model<T, H>;
    skip(): Model<T, H>;
    sort(): Model<T, H>;
    where(): Model<T, H>;
}

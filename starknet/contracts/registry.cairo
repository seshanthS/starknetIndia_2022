%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin

struct Condition {
    max: felt,
    min: felt,
}

@storage_var
func info(id:felt) -> (res: Condition){
}

@external
func setInfo{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    id: felt, cond: Condition
) {
    info.write(id, cond);
    return ();
}

@view
func getInfo{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(id: felt) -> (res: Condition){
    let result:Condition = info.read(id);
    return (res=result);
}

%builtins output range_check
from starkware.cairo.common.math import (assert_in_range,assert_le)

func main{output_ptr: felt*, range_check_ptr} () {
    alloc_locals;

    local max;
    local min;
    local inputValue;

    %{
        ids.max = program_input['max']
        ids.min = program_input['min']
        ids.inputValue = program_input['inputValue']
    %}

    assert_in_range(inputValue, min, max);
    return ();

}

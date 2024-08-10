
function main () {
    let checkedAmenities = {};
    $('.amenities li input[type="checkbox"]').on('change', function () {
        let $this = $(this);
        if ($this.is(':checked')) {
            checkedAmenities[$this.data('id')] = $this.data('name');
        } else {
            delete checkedAmenities[$this.data('id')];
        }
        if (Object.keys(checkedAmenities).length === 0) {
            $('.amenities > h4').html('&nbsp;');
        } else {
            $('.amenities > h4').text(Object.values(checkedAmenities).join(', '));
        }
    });
    
    $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
        if (data.status === 'OK') {
            $('div#api_status').addClass('available');
        }else {
            $('div#api_status').removeClass('available');
        }
    });
}

$('document').ready(main);

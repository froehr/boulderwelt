from flask import Blueprint, jsonify, request

from db import Session
from models import Boulderworld, Utilization

api = Blueprint('api', __name__)


@api.route('/api/boulderworlds/<short_name>', methods=['GET'])
def get_boulderworld_utilization(short_name):
    assert short_name == request.view_args['short_name']
    boulderworld = Session.query(Boulderworld)\
        .filter_by(short_name=short_name).first()

    utilizations = Session.query(Utilization) \
        .filter_by(boulderworld_id=boulderworld.id).order_by(Utilization.id.asc())

    utilization_values = []

    for utilization in utilizations:
        utilization_values.append(utilization.utilization)

    trend_value = get_trend(utilization_values)
    print(trend_value)

    return jsonify(utilizations)


def get_trend(numbers):
    rows = []
    total_numbers = len(numbers)
    current_value_number = 1
    n = 0
    while n < len(numbers):
        rows.append({'row': current_value_number, 'number': numbers[n]})
        current_value_number += 1
        n += 1
    sum_lines = 0
    sum_numbers = 0
    sum_mix = 0
    square_ofs = 0
    for k in rows:
        sum_lines += k['row']
        sum_numbers += k['number']
        sum_mix += k['row']*k['number']
        square_ofs += k['row'] ** 2
    a = (total_numbers * sum_mix) - (sum_lines * sum_numbers)
    b = (total_numbers * square_ofs) - (sum_lines ** 2)
    c = a/b
    return c


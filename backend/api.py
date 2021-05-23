from flask import Blueprint, jsonify, request

from dto import UtilizationDTO, BoulderworldDTO
from db import Session
from models import Boulderworld, Utilization

api = Blueprint('api', __name__)


@api.route('/api/boulderworlds/<short_name>/utilizations', methods=['GET'])
def get_boulderworld_utilization(short_name):
    assert short_name == request.view_args['short_name']
    boulderworld = Session.query(Boulderworld) \
        .filter_by(short_name=short_name).first()

    utilizations = Session.query(Utilization) \
        .filter_by(boulderworld_id=boulderworld.id).order_by(
        Utilization.id.asc())

    utilization_dtos = []

    for utilization in utilizations:
        utilization_dtos.append(
            UtilizationDTO(utilization.date_time, utilization.utilization,
                           utilization.people_waiting))

    boulderworld_dto = BoulderworldDTO(name=boulderworld.name,
                                       is_open=boulderworld.is_open,
                                       utilizations=utilization_dtos)

    return jsonify(boulderworld_dto)

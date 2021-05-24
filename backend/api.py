from flask import Blueprint, jsonify, request

from dto import UtilizationDTO, BoulderworldDTO
from db import Session
from models import Boulderworld, Utilization

from sqlalchemy import Date, cast
from datetime import date, timedelta

api = Blueprint('api', __name__)


@api.route('/api/boulderworlds/<short_name>/utilizations/current', methods=['GET'])
def get_boulderworld_utilization_of_now(short_name):
    assert short_name == request.view_args['short_name']
    boulderworld = Session.query(Boulderworld) \
        .filter_by(short_name=short_name).first()

    utilization = Session.query(Utilization) \
        .filter_by(boulderworld_id=boulderworld.id) \
        .order_by(Utilization.id.desc()).first()

    boulderworld_dto = BoulderworldDTO(name=boulderworld.name,
                                       is_open=boulderworld.is_open, utilizations=None)

    if utilization:
        boulderworld_dto.utilizations = UtilizationDTO(utilization.date_time,
                utilization.utilization, utilization.people_waiting)

    return jsonify(boulderworld_dto)

@api.route('/api/boulderworlds/<short_name>/utilizations/today', methods=['GET'])
def get_boulderworld_utilization_of_today(short_name):
    assert short_name == request.view_args['short_name']
    boulderworld = Session.query(Boulderworld) \
        .filter_by(short_name=short_name).first()

    utilization_dtos = get_utilization_x_days_ago(boulderworld, 0)
    boulderworld_dto = BoulderworldDTO(name=boulderworld.name,
                                       is_open=boulderworld.is_open,
                                       utilizations=utilization_dtos)

    return jsonify(boulderworld_dto)


@api.route('/api/boulderworlds/<short_name>/utilizations/lastweek', methods=['GET'])
def get_boulderworld_utilization_of_7_days_ago(short_name):
    assert short_name == request.view_args['short_name']
    boulderworld = Session.query(Boulderworld) \
        .filter_by(short_name=short_name).first()

    utilization_dtos = get_utilization_x_days_ago(boulderworld, 7)
    boulderworld_dto = BoulderworldDTO(name=boulderworld.name,
                                       is_open=boulderworld.is_open,
                                       utilizations=utilization_dtos)

    return jsonify(boulderworld_dto)


def get_utilization_x_days_ago(boulderworld, days_ago):
    utilizations = Session.query(Utilization) \
        .filter_by(boulderworld_id=boulderworld.id) \
        .order_by(Utilization.id.asc()) \
        .filter(cast(Utilization.date_time, Date) == date.today() - timedelta(days=days_ago))

    utilization_dtos = []

    for utilization in utilizations:
        utilization_dtos.append(
                UtilizationDTO(utilization.date_time, utilization.utilization,
                               utilization.people_waiting))

    return utilization_dtos

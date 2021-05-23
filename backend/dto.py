import datetime as datetime


class BoulderworldDTO(dict):
    def __init__(self, name, is_open, utilizations):
        dict.__init__(self, name=name, is_open=is_open,
                      utilizations=utilizations)

    name: str
    is_open: bool
    utilizations: list


class UtilizationDTO(dict):
    def __init__(self, date_time, utilization, people_waiting):
        dict.__init__(self, date_time=date_time, utilization=utilization,
                      people_waiting=people_waiting)

    date_time: datetime
    utilization: int
    people_waiting: int

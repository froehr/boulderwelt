import datetime as datetime
from dataclasses import dataclass

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

Base = declarative_base()


@dataclass
class Boulderworld(Base):
    __tablename__ = 'boulderworld'

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    url = Column(String(200))
    short_name = Column(String(10))
    is_open = Column(Boolean)
    utilizations = relationship("Utilization")

    id: int
    name: str
    url: str
    short_name: str
    is_open: bool


@dataclass
class Utilization(Base):
    __tablename__ = 'utilization'

    id = Column(Integer, primary_key=True)
    date_time = Column(DateTime)
    utilization = Column(Integer)
    people_waiting = Column(Integer)
    boulderworld_id = Column(Integer, ForeignKey('boulderworld.id'))

    id: int
    date_time: datetime
    utilization: int
    people_waiting: int
    boulderworld_id: int

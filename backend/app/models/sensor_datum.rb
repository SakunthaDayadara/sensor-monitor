class SensorDatum < ApplicationRecord
  belongs_to :sensor, foreign_key: 'sensor_id'
end

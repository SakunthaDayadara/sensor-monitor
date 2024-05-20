class SensorThreshold < ApplicationRecord
  belongs_to :sensor, foreign_key: 'sensor_id'

  self.primary_key = 'threshold_id'
end

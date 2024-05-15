class Sensor < ApplicationRecord
  belongs_to :user, foreign_key: 'user_id'
  has_many :sensor_data, dependent: :destroy
  has_one :sensor_threshold, dependent: :destroy

  self.primary_key = 'sensor_id'
end

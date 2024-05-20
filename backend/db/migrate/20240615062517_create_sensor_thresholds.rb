class CreateSensorThresholds < ActiveRecord::Migration[7.0]
  def change
    create_table :sensor_thresholds, id: false do |t|
      t.string :sensor_id, primary_key: true, unique: true
      t.integer :threshold_value

      t.timestamps
    end
  end
end

class CreateSensorData < ActiveRecord::Migration[7.0]
  def change
    create_table :sensor_data do |t|
      t.string :sensor_id
      t.date :date_column
      t.time :time_column
      t.integer :data_value

      t.timestamps
    end

    add_foreign_key :sensor_data, :sensors, column: :sensor_id, primary_key: :sensor_id
  end
end

class CreateSensors < ActiveRecord::Migration[7.0]
  def change
    create_table :sensors, id: false do |t|
      t.string :sensor_id, primary_key: true, unique: true
      t.string :user_id

      t.timestamps
    end

    add_foreign_key :sensors, :users, column: :user_id, primary_key: :user_id
  end
end

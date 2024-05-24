# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_06_15_162456) do
    # These are extensions that must be enabled in order to support this database
    enable_extension "plpgsql"
  
    create_table "sensor_data", force: :cascade do |t|
      t.string "sensor_id"
      t.date "date_column"
      t.string "time_column"
      t.integer "data_value"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
    end
  
    create_table "sensor_thresholds", primary_key: "sensor_id", id: :string, force: :cascade do |t|
      t.integer "threshold_value"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.string "state", default: "active"
    end
  
    create_table "sensors", primary_key: "sensor_id", id: :string, force: :cascade do |t|
      t.string "user_id"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
    end
  
    create_table "users", primary_key: "user_id", id: :string, force: :cascade do |t|
      t.string "name"
      t.string "username"
      t.string "password_digest"
      t.string "telephone"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
      t.string "email"
    end
  
    add_foreign_key "sensor_data", "sensors", primary_key: "sensor_id"
    add_foreign_key "sensors", "users", primary_key: "user_id"
  end
  
class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users, id: false do |t|
      t.string :user_id, primary_key: true, unique: true
      t.string :name
      t.string :username
      t.string :password_digest
      t.string :telephone

      t.timestamps
    end
  end
end

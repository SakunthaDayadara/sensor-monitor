class User < ApplicationRecord
  has_secure_password
  has_many :sensor, dependent: :destroy
  before_create :generate_user_id

  self.primary_key = 'user_id'

  private

    def generate_user_id
      last_user = User.last
      if last_user.nil?
        self.user_id = 'US0001'
      else
        last_id = last_user.user_id[2..-1].to_i
        new_id = last_id + 1
        self.user_id = "US#{'%04d' % new_id}"
      end
    end


end

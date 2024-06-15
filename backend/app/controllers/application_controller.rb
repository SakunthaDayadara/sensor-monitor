class ApplicationController < ActionController::API
  before_action :authorized

  def authorized
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    if token
      begin
        @decoded = JsonWebToken.decode(token)
        @current_user = User.find(@decoded[:user_id])
      rescue ActiveRecord::RecordNotFound => e
        render json: { errors: 'User not found' }, status: :unauthorized
      rescue JWT::DecodeError => e
        render json: { errors: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { errors: 'Token not provided' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def require_authorization
    render json: { errors: 'Not authorized' }, status: :unauthorized unless current_user
  end
end

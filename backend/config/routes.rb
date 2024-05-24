Rails.application.routes.draw do
  resources :sensor_thresholds do
    collection do
      patch 'edit_threshold'
    end
  end
  resources :sensor_data do
    collection do
      get 'find_by_sensor_id'
      get 'find_by_user_id'
    end
  end
  resources :sensors do
    collection do
      get 'find_by_user_id'
    end
  end
  resources :users do
    collection do
      post 'login'
      get 'auto_login'
      get 'find_by_user_id'
    end

  end

  post 'send_sms', to: 'sms#send_sms'
  post 'send_otp', to: 'sms#send_otp'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end

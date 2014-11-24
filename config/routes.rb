# == Route Map
#
#    Prefix Verb   URI Pattern               Controller#Action
#      root GET    /                         pages#index
#     users GET    /users(.:format)          users#index
#           POST   /users(.:format)          users#create
#  new_user GET    /users/new(.:format)      users#new
# edit_user GET    /users/:id/edit(.:format) users#edit
#      user GET    /users/:id(.:format)      users#show
#           PATCH  /users/:id(.:format)      users#update
#           PUT    /users/:id(.:format)      users#update
#           DELETE /users/:id(.:format)      users#destroy
#    threeD GET    /threeD(.:format)         music#threeD
#      dots GET    /dots(.:format)           music#dots
#   circles GET    /circles(.:format)        music#circles
#    colour GET    /colour(.:format)         music#colour
#

Rails.application.routes.draw do

  root :to => 'pages#index'

  resources :users

  get '/threeD' => 'music#threeD'
  get '/dots' => 'music#dots'
  get '/circles' => 'music#circles'
  get '/colour' => 'music#colour'

end

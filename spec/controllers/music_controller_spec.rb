require 'rails_helper'

RSpec.describe MusicController, :type => :controller do

  describe "GET 3d" do
    it "returns http success" do
      get :3d
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET dots" do
    it "returns http success" do
      get :dots
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET circles" do
    it "returns http success" do
      get :circles
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET colour" do
    it "returns http success" do
      get :colour
      expect(response).to have_http_status(:success)
    end
  end

end

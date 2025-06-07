class DetailsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_current_user, only: [:profile]

  def about_lina
  end

  def about_dev
  end

  def profile
  end

  private

  def set_current_user
    @user = current_user
  end
end

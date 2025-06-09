module ApplicationHelper
  def bot_avatar(size: "size-10")
    image_tag "lina_avatar.png", alt: "Lina avatar", class: "#{size} rounded-full object-cover flex-shrink-0"
  end

  def dev_avatar(size: "size-16")
    image_tag "dev_avatar.png", alt: "Dev avatar", class: "#{size} rounded-full object-cover flex-shrink-0"
  end

  def user_avatar(size: "size-10")
    image_tag "user_avatar.png", alt: "User avatar", class: "#{size} rounded-full object-cover flex-shrink-0"
  end

  def min_password_length
    @minimum_password_length || Devise.password_length.min || 6
  end

end

module ApplicationHelper

  def bot_avatar(size: "size-10")
    image_tag "lina_avatar.png", alt: "Lina avatar", class: "#{size} rounded-full object-cover"
  end

  def dev_avatar(size: "size-16")
    image_tag "dev_avatar.png", alt: "Dev avatar", class: "#{size} rounded-full object-cover"
  end
end

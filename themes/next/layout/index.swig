{% extends '_layout.swig' %}
{% block title %}{{ title }}{%- if theme.index_with_subtitle and subtitle %} - {{ subtitle }}{%- endif %}{% endblock %}
{% block class %}index posts-expand{% endblock %}

{% block content %}

  {# Featured Projects Section #}
  {% include '_partials/projects.swig' %}

  {# Latest Blogs Section #}
  {% include '_partials/blogs.swig' %}

  {# Skills Summary Section | 临时隐藏 #}
  {# {% include '_partials/skills.swig' %} #}

  {# About & CTA Section #}
  {% include '_partials/about.swig' %}
{% endblock %} 
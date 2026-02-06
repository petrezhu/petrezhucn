<section class="projects-section" id="projects">
  <h2 class="section-title">项目经验</h2>
  <div class="projects-grid">
    {% if site.data.projects and site.data.projects.length %}
      {% for project in site.data.projects %}
        {% if project.highlight %}
        <div class="project-card">
          <div class="project-thumb">
            <img src="{{ project.thumbnail }}" alt="{{ project.title }}">
          </div>
          <div class="project-info">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-desc">{{ project.description }}</p>
            <div class="project-tags">
              {% for tag in project.tech_stack %}
                <span class="project-tag">{{ tag }}</span>
              {% endfor %}
            </div>
            <div class="project-actions">
              {% if project.detail_url %}
                <a href="{{ project.detail_url }}" class="btn btn-secondary">探索详情</a>
              {% endif %}
              {% if project.demo_url %}
                <a href="{{ project.demo_url }}" class="btn btn-primary" target="_blank">在线演示</a>
              {% endif %}
            </div>
          </div>
        </div>
        {% endif %}
      {% endfor %}
    {% endif %}
  </div>
</section> 
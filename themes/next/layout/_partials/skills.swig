<section class="skills-section" id="skills">
  <h2 class="section-title">技能摘要</h2>
  <div class="skills-list">
    {% if theme.skills and theme.skills.length %}
      {% for skill in theme.skills %}
        <div class="skill-item">
          <span class="skill-name">{{ skill.name }}</span>
          <div class="skill-bar-bg">
            <div class="skill-bar" style="width: {{ skill.level }}%"></div>
          </div>
          <span class="skill-level">{{ skill.level }}%</span>
        </div>
      {% endfor %}
    {% endif %}
  </div>
</section> 
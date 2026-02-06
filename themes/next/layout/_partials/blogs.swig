<section class="blogs-section" id="blogs">
  <h2 class="section-title">博客精选</h2>
  <div class="blogs-grid">
    {% for post in site.posts | sort(attribute='date', reverse=true) | slice(0, 3) %}
      <div class="blog-card">
        <h3 class="blog-title"><a href="{{ url_for(post.path) }}">{{ post.title }}</a></h3>
        <div class="blog-tags">
          {% for tag in post.tags %}
            <span class="blog-tag">{{ tag.name }}</span>
          {% endfor %}
        </div>
        <p class="blog-excerpt">{{ post.excerpt | striptags | truncate(50, true) }}</p>
        <a href="{{ url_for(post.path) }}" class="btn btn-secondary">阅读全文</a>
      </div>
    {% endfor %}
  </div>
  <div class="blogs-more">
    <a href="/archives" class="btn btn-primary">浏览所有文章</a>
  </div>
</section> 
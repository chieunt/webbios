import React from 'react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { Container } from '../shared/Container';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  authorAvatar?: string;
  image?: string;
  slug: string;
}

export interface BlogProps {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
}

export function Blog({ 
  title = "Blog", 
  subtitle = "Latest news, updates, and articles.",
  posts = [] 
}: BlogProps) {
  return (
    <SectionWrapper id="blog" background="default">
      <Container>
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">{subtitle}</p>
        </div>

        {posts.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            No posts found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <a 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md"
              >
                {post.image && (
                  <div className="w-full h-48 overflow-hidden bg-muted">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                
                <div className="flex flex-col flex-1 p-6 md:p-8">
                  <div className="text-sm text-muted-foreground mb-3">
                    {post.date}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed flex-1 line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-auto">
                    {post.authorAvatar ? (
                      <img 
                        src={post.authorAvatar} 
                        alt={post.author} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-xs">
                        {post.author.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground/80">{post.author}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </Container>
    </SectionWrapper>
  );
}

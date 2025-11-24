export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string;
          site_name: string;
          tagline: string;
          logo_url: string | null;
          show_company_name: boolean;
          primary_color: string;
          secondary_color: string;
          accent_color: string;
          font_heading: string;
          font_body: string;
          phone: string;
          fax: string;
          email: string;
          address_line1: string;
          address_line2: string;
          facebook_url: string | null;
          linkedin_url: string | null;
          twitter_url: string | null;
          footer_text: string | null;
          show_ccifp: boolean;
          ccifp_title: string;
          ccifp_description: string;
          ccifp_badge_url: string | null;
          show_dopecfo: boolean;
          dopecfo_title: string;
          dopecfo_description: string;
          dopecfo_badge_url: string | null;
          calendly_url: string | null;
          values_tagline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>;
      };
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          meta_description: string | null;
          parent_id: string | null;
          is_published: boolean;
          show_in_nav: boolean;
          nav_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pages']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['pages']['Insert']>;
      };
      page_sections: {
        Row: {
          id: string;
          page_id: string;
          section_type: string;
          title: string | null;
          content: string | null;
          image_url: string | null;
          button_text: string | null;
          button_link: string | null;
          background_color: string | null;
          section_order: number;
          settings: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['page_sections']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['page_sections']['Insert']>;
      };
      services: {
        Row: {
          id: string;
          category: string;
          title: string;
          slug: string;
          description: string;
          full_content: string | null;
          icon: string | null;
          parent_id: string | null;
          display_order: number;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          title: string;
          bio: string | null;
          photo_url: string | null;
          email: string | null;
          phone: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['team_members']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>;
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          best_time_to_call: string | null;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_submissions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>;
      };
      navigation_items: {
        Row: {
          id: string;
          label: string;
          url: string;
          parent_id: string | null;
          nav_order: number;
          is_external: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['navigation_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['navigation_items']['Insert']>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          featured_image_url: string | null;
          author_name: string;
          is_featured: boolean;
          is_published: boolean;
          view_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at' | 'view_count'>;
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['blog_categories']['Insert']>;
      };
      blog_post_categories: {
        Row: {
          blog_post_id: string;
          category_id: string;
        };
        Insert: Database['public']['Tables']['blog_post_categories']['Row'];
        Update: Partial<Database['public']['Tables']['blog_post_categories']['Row']>;
      };
      certifications: {
        Row: {
          id: string;
          title: string;
          description: string;
          badge_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['certifications']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['certifications']['Insert']>;
      };
      hero_content: {
        Row: {
          id: string;
          heading: string;
          subheading: string | null;
          cta_text: string | null;
          cta_link: string | null;
          hero_image_url: string | null;
          hero_image_scale: number;
          hero_image_position_x: number;
          hero_image_position_y: number;
          hero_image_opacity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hero_content']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['hero_content']['Insert']>;
      };
      value_tiles: {
        Row: {
          id: string;
          icon: string;
          title: string;
          description: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['value_tiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['value_tiles']['Insert']>;
      };
    };
  };
}

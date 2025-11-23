export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string;
          site_name: string;
          tagline: string;
          logo_url: string | null;
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
    };
  };
}

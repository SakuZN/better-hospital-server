export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: Database["public"]["Enums"]["dashboard_actions_enum"]
          created_at: string
          details: string | null
          device_details: string | null
          hospital_id: string
          id: string
          ip_address: string | null
          ok_response: boolean | null
          raw_request: Json | null
          raw_response: Json | null
          screen: Database["public"]["Enums"]["dashboard_screens_enum"]
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["dashboard_actions_enum"]
          created_at?: string
          details?: string | null
          device_details?: string | null
          hospital_id: string
          id?: string
          ip_address?: string | null
          ok_response?: boolean | null
          raw_request?: Json | null
          raw_response?: Json | null
          screen: Database["public"]["Enums"]["dashboard_screens_enum"]
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["dashboard_actions_enum"]
          created_at?: string
          details?: string | null
          device_details?: string | null
          hospital_id?: string
          id?: string
          ip_address?: string | null
          ok_response?: boolean | null
          raw_request?: Json | null
          raw_response?: Json | null
          screen?: Database["public"]["Enums"]["dashboard_screens_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      block_templates: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          hospital_id: string | null
          id: string
          name: string
          preview_image_url: string | null
          template_data: Json
          type: Database["public"]["Enums"]["template_type"]
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          hospital_id?: string | null
          id?: string
          name: string
          preview_image_url?: string | null
          template_data: Json
          type?: Database["public"]["Enums"]["template_type"]
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          hospital_id?: string | null
          id?: string
          name?: string
          preview_image_url?: string | null
          template_data?: Json
          type?: Database["public"]["Enums"]["template_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "block_templates_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      bulletin_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          hospital_id: string
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          slug: string
          summary: string | null
          title: string
          type: Database["public"]["Enums"]["bulletin_type"]
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          hospital_id: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          summary?: string | null
          title: string
          type: Database["public"]["Enums"]["bulletin_type"]
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          hospital_id?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          summary?: string | null
          title?: string
          type?: Database["public"]["Enums"]["bulletin_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulletin_posts_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_configurations: {
        Row: {
          away_message: string | null
          created_at: string
          hospital_id: string
          id: string
          is_enabled: boolean
          office_hours: Json | null
          quick_replies: Json | null
          updated_at: string
          welcome_message: string | null
        }
        Insert: {
          away_message?: string | null
          created_at?: string
          hospital_id: string
          id?: string
          is_enabled?: boolean
          office_hours?: Json | null
          quick_replies?: Json | null
          updated_at?: string
          welcome_message?: string | null
        }
        Update: {
          away_message?: string | null
          created_at?: string
          hospital_id?: string
          id?: string
          is_enabled?: boolean
          office_hours?: Json | null
          quick_replies?: Json | null
          updated_at?: string
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_configurations_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: true
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_transcripts: {
        Row: {
          agent_id: string | null
          chat_id: string
          created_at: string
          duration_seconds: number | null
          ended_at: string
          guest_display_name: string | null
          hospital_id: string
          id: string
          started_at: string
          transcript: Json | null
        }
        Insert: {
          agent_id?: string | null
          chat_id: string
          created_at?: string
          duration_seconds?: number | null
          ended_at: string
          guest_display_name?: string | null
          hospital_id: string
          id?: string
          started_at: string
          transcript?: Json | null
        }
        Update: {
          agent_id?: string | null
          chat_id?: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string
          guest_display_name?: string | null
          hospital_id?: string
          id?: string
          started_at?: string
          transcript?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_transcripts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_transcripts_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          admin_domain: string | null
          city: string | null
          clinic_id: string | null
          contact_info: Json | null
          created_at: string
          domain: string
          favicon_url: string | null
          featured_doctors: string[] | null
          footer_config: Json | null
          header_config: Json | null
          hmos: string[] | null
          id: string
          keywords: string[] | null
          logo_transparent: string | null
          logo_url: string | null
          name: string
          ns_name: string | null
          og_url: string | null
          psgc_code: string | null
          referrer: string | null
          short_description: string | null
          theme_config: Json | null
          updated_at: string
        }
        Insert: {
          admin_domain?: string | null
          city?: string | null
          clinic_id?: string | null
          contact_info?: Json | null
          created_at?: string
          domain: string
          favicon_url?: string | null
          featured_doctors?: string[] | null
          footer_config?: Json | null
          header_config?: Json | null
          hmos?: string[] | null
          id?: string
          keywords?: string[] | null
          logo_transparent?: string | null
          logo_url?: string | null
          name: string
          ns_name?: string | null
          og_url?: string | null
          psgc_code?: string | null
          referrer?: string | null
          short_description?: string | null
          theme_config?: Json | null
          updated_at?: string
        }
        Update: {
          admin_domain?: string | null
          city?: string | null
          clinic_id?: string | null
          contact_info?: Json | null
          created_at?: string
          domain?: string
          favicon_url?: string | null
          featured_doctors?: string[] | null
          footer_config?: Json | null
          header_config?: Json | null
          hmos?: string[] | null
          id?: string
          keywords?: string[] | null
          logo_transparent?: string | null
          logo_url?: string | null
          name?: string
          ns_name?: string | null
          og_url?: string | null
          psgc_code?: string | null
          referrer?: string | null
          short_description?: string | null
          theme_config?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          answers: Json | null
          consent: Json
          cover_letter: string | null
          created_at: string
          email: string
          first_name: string
          has_prc_license: boolean | null
          hospital_id: string
          id: string
          job_id: string
          job_snapshot: Json | null
          last_name: string
          meta: Json | null
          middle_name: string | null
          mobile: string | null
          resume: string | null
          status: Database["public"]["Enums"]["job_application_status"]
          updated_at: string
        }
        Insert: {
          answers?: Json | null
          consent: Json
          cover_letter?: string | null
          created_at?: string
          email: string
          first_name: string
          has_prc_license?: boolean | null
          hospital_id: string
          id?: string
          job_id: string
          job_snapshot?: Json | null
          last_name: string
          meta?: Json | null
          middle_name?: string | null
          mobile?: string | null
          resume?: string | null
          status?: Database["public"]["Enums"]["job_application_status"]
          updated_at?: string
        }
        Update: {
          answers?: Json | null
          consent?: Json
          cover_letter?: string | null
          created_at?: string
          email?: string
          first_name?: string
          has_prc_license?: boolean | null
          hospital_id?: string
          id?: string
          job_id?: string
          job_snapshot?: Json | null
          last_name?: string
          meta?: Json | null
          middle_name?: string | null
          mobile?: string | null
          resume?: string | null
          status?: Database["public"]["Enums"]["job_application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listings: {
        Row: {
          benefits: string[] | null
          contact_methods: Json | null
          created_at: string
          department: string | null
          description: string
          fts: unknown | null
          hospital_id: string
          id: string
          images: Json
          is_active: boolean
          is_featured: boolean
          location: string | null
          requirements: string[] | null
          responsibilities: string[] | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: string[] | null
          contact_methods?: Json | null
          created_at?: string
          department?: string | null
          description?: string
          fts?: unknown | null
          hospital_id: string
          id?: string
          images?: Json
          is_active?: boolean
          is_featured?: boolean
          location?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string[] | null
          contact_methods?: Json | null
          created_at?: string
          department?: string | null
          description?: string
          fts?: unknown | null
          hospital_id?: string
          id?: string
          images?: Json
          is_active?: boolean
          is_featured?: boolean
          location?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_listings_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      job_site_configs: {
        Row: {
          brevo: Json | null
          contact_methods: Json | null
          created_at: string
          form: Json | null
          hospital_id: string
          hr_email: string
          support_email: string | null
          updated_at: string
        }
        Insert: {
          brevo?: Json | null
          contact_methods?: Json | null
          created_at?: string
          form?: Json | null
          hospital_id: string
          hr_email: string
          support_email?: string | null
          updated_at?: string
        }
        Update: {
          brevo?: Json | null
          contact_methods?: Json | null
          created_at?: string
          form?: Json | null
          hospital_id?: string
          hr_email?: string
          support_email?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_site_configs_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: true
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string
          hospital_id: string
          id: string
          is_published: boolean | null
          keywords: string[] | null
          page_description: string | null
          page_title: string | null
          parent_page_id: string | null
          route: string
          sections: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          hospital_id: string
          id?: string
          is_published?: boolean | null
          keywords?: string[] | null
          page_description?: string | null
          page_title?: string | null
          parent_page_id?: string | null
          route?: string
          sections?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          hospital_id?: string
          id?: string
          is_published?: boolean | null
          keywords?: string[] | null
          page_description?: string | null
          page_title?: string | null
          parent_page_id?: string | null
          route?: string
          sections?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_parent_page_id_fkey"
            columns: ["parent_page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      posthog_analytics: {
        Row: {
          analytics: Json | null
          created_at: string
          hospital_id: string | null
          id: string
          params: Json | null
        }
        Insert: {
          analytics?: Json | null
          created_at?: string
          hospital_id?: string | null
          id?: string
          params?: Json | null
        }
        Update: {
          analytics?: Json | null
          created_at?: string
          hospital_id?: string | null
          id?: string
          params?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "posthog_analytics_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      posthog_config: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          project_id: number
          project_key: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          project_id: number
          project_key: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          project_id?: number
          project_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "posthog_config_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      pricelist_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          discounted_price: number | null
          hospital_id: string
          id: string
          is_active: boolean
          name: string
          preparation_notes: string | null
          price: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          discounted_price?: number | null
          hospital_id: string
          id?: string
          is_active?: boolean
          name: string
          preparation_notes?: string | null
          price: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          discounted_price?: number | null
          hospital_id?: string
          id?: string
          is_active?: boolean
          name?: string
          preparation_notes?: string | null
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricelist_items_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      pricelist_suggestions: {
        Row: {
          category: string
          category_icon: string | null
          created_at: string
          hospital_id: string
          id: string
          order_number: number | null
          search_terms: string[]
          updated_at: string
        }
        Insert: {
          category: string
          category_icon?: string | null
          created_at?: string
          hospital_id: string
          id?: string
          order_number?: number | null
          search_terms: string[]
          updated_at?: string
        }
        Update: {
          category?: string
          category_icon?: string | null
          created_at?: string
          hospital_id?: string
          id?: string
          order_number?: number | null
          search_terms?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricelist_suggestions_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      promos: {
        Row: {
          banner_url: string | null
          contact_info: Json | null
          created_at: string
          description: string | null
          end_date: string | null
          hospital_id: string
          how_to_avail: string | null
          id: string
          image_url: string | null
          inclusions: Json | null
          is_active: boolean
          is_featured: boolean
          original_price: number | null
          price: number
          slug: string
          start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          hospital_id: string
          how_to_avail?: string | null
          id?: string
          image_url?: string | null
          inclusions?: Json | null
          is_active?: boolean
          is_featured?: boolean
          original_price?: number | null
          price: number
          slug: string
          start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          hospital_id?: string
          how_to_avail?: string | null
          id?: string
          image_url?: string | null
          inclusions?: Json | null
          is_active?: boolean
          is_featured?: boolean
          original_price?: number | null
          price?: number
          slug?: string
          start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promos_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      role_templates: {
        Row: {
          created_at: string
          description: string | null
          hospital_id: string | null
          id: string
          is_system_role: boolean
          name: string
          template: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          hospital_id?: string | null
          id?: string
          is_system_role?: boolean
          name: string
          template: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          hospital_id?: string | null
          id?: string
          is_system_role?: boolean
          name?: string
          template?: Json
        }
        Relationships: [
          {
            foreignKeyName: "role_templates_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          hospital_id: string
          icon_name: string | null
          id: string
          image_url: string | null
          images: Json[] | null
          is_active: boolean | null
          is_featured: boolean
          key_services: Json | null
          key_services_description: string | null
          keywords: string[] | null
          name: string
          quick_info: Json | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hospital_id: string
          icon_name?: string | null
          id?: string
          image_url?: string | null
          images?: Json[] | null
          is_active?: boolean | null
          is_featured?: boolean
          key_services?: Json | null
          key_services_description?: string | null
          keywords?: string[] | null
          name: string
          quick_info?: Json | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hospital_id?: string
          icon_name?: string | null
          id?: string
          image_url?: string | null
          images?: Json[] | null
          is_active?: boolean | null
          is_featured?: boolean
          key_services?: Json | null
          key_services_description?: string | null
          keywords?: string[] | null
          name?: string
          quick_info?: Json | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      special_pages: {
        Row: {
          created_at: string
          hospital_id: string
          id: string
          page_key: Database["public"]["Enums"]["special_page_key_enum"]
          should_show: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          hospital_id: string
          id?: string
          page_key: Database["public"]["Enums"]["special_page_key_enum"]
          should_show?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          hospital_id?: string
          id?: string
          page_key?: Database["public"]["Enums"]["special_page_key_enum"]
          should_show?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "special_pages_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author_name: string
          author_subtext: string | null
          avatar_url: string | null
          created_at: string
          hospital_id: string
          id: string
          is_featured: boolean | null
          quote: string
          updated_at: string
        }
        Insert: {
          author_name: string
          author_subtext?: string | null
          avatar_url?: string | null
          created_at?: string
          hospital_id: string
          id?: string
          is_featured?: boolean | null
          quote: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_subtext?: string | null
          avatar_url?: string | null
          created_at?: string
          hospital_id?: string
          id?: string
          is_featured?: boolean | null
          quote?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          hospital_id: string
          id: string
          last_name: string | null
          permissions: Json
          role_template_id: string | null
          status: Database["public"]["Enums"]["user_account_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          hospital_id: string
          id: string
          last_name?: string | null
          permissions?: Json
          role_template_id?: string | null
          status?: Database["public"]["Enums"]["user_account_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          hospital_id?: string
          id?: string
          last_name?: string | null
          permissions?: Json
          role_template_id?: string | null
          status?: Database["public"]["Enums"]["user_account_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_role_template_id_fkey"
            columns: ["role_template_id"]
            isOneToOne: false
            referencedRelation: "role_templates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      detailed_activity_logs: {
        Row: {
          action: Database["public"]["Enums"]["dashboard_actions_enum"] | null
          details: string | null
          hospital: string | null
          name: string | null
          ok_response: boolean | null
          screen: Database["public"]["Enums"]["dashboard_screens_enum"] | null
          timestamp: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_permission: {
        Args: { actions: Json; category_name: string }
        Returns: undefined
      }
      distinct_career_departments: {
        Args: { hid: string }
        Returns: {
          department: string
        }[]
      }
      get_distinct_bulletin_years: {
        Args: { p_hospital_id: string }
        Returns: number[]
      }
      get_distinct_job_attributes: {
        Args: { p_attribute_name: string; p_hospital_id: string }
        Returns: {
          value: string
        }[]
      }
      get_my_hospital_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_permission: {
        Args: { permission_action: string; permission_category: string }
        Returns: boolean
      }
    }
    Enums: {
      bulletin_type: "news" | "article" | "announcement"
      dashboard_actions_enum:
        | "CREATE"
        | "UPDATE"
        | "DELETE"
        | "VIEW"
        | "LOGIN"
        | "LOGOUT"
        | "PUBLISH"
        | "UNPUBLISH"
      dashboard_screens_enum:
        | "PAGES"
        | "SERVICES"
        | "BULLETIN"
        | "JOBS"
        | "TESTIMONIALS"
        | "USERS"
        | "SETTINGS"
        | "ROLES"
        | "PROMOS"
        | "PRICELIST"
      job_application_status:
        | "new"
        | "reviewing"
        | "interview"
        | "accepted"
        | "rejected"
      special_page_key_enum:
        | "bulletin"
        | "careers"
        | "doctors"
        | "pricelist"
        | "promos"
        | "services"
      template_type: "page" | "block"
      user_account_status: "pending" | "active" | "disabled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      bulletin_type: ["news", "article", "announcement"],
      dashboard_actions_enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "VIEW",
        "LOGIN",
        "LOGOUT",
        "PUBLISH",
        "UNPUBLISH",
      ],
      dashboard_screens_enum: [
        "PAGES",
        "SERVICES",
        "BULLETIN",
        "JOBS",
        "TESTIMONIALS",
        "USERS",
        "SETTINGS",
        "ROLES",
        "PROMOS",
        "PRICELIST",
      ],
      job_application_status: [
        "new",
        "reviewing",
        "interview",
        "accepted",
        "rejected",
      ],
      special_page_key_enum: [
        "bulletin",
        "careers",
        "doctors",
        "pricelist",
        "promos",
        "services",
      ],
      template_type: ["page", "block"],
      user_account_status: ["pending", "active", "disabled"],
    },
  },
} as const

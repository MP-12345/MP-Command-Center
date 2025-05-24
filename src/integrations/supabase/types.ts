export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_permissions: {
        Row: {
          actions: string[]
          created_at: string | null
          department: Database["public"]["Enums"]["admin_role"]
          id: string
          resource: string
        }
        Insert: {
          actions: string[]
          created_at?: string | null
          department: Database["public"]["Enums"]["admin_role"]
          id?: string
          resource: string
        }
        Update: {
          actions?: string[]
          created_at?: string | null
          department?: Database["public"]["Enums"]["admin_role"]
          id?: string
          resource?: string
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          admin_user_id: string | null
          created_at: string | null
          expires_at: string
          id: string
          session_token: string
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          session_token: string
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          department: Database["public"]["Enums"]["admin_role"]
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          last_login: string | null
          pin_hash: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department: Database["public"]["Enums"]["admin_role"]
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          pin_hash: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: Database["public"]["Enums"]["admin_role"]
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          pin_hash?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          bank_code: string
          bank_name: string
          created_at: string | null
          id: string
          is_verified: boolean | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          bank_code: string
          bank_name: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_code?: string
          bank_name?: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_tokens: {
        Row: {
          coingecko_id: string | null
          contract_address: string
          created_at: string
          decimals: number | null
          id: string
          name: string
          network: string
          symbol: string
          user_id: string
        }
        Insert: {
          coingecko_id?: string | null
          contract_address: string
          created_at?: string
          decimals?: number | null
          id?: string
          name: string
          network: string
          symbol: string
          user_id: string
        }
        Update: {
          coingecko_id?: string | null
          contract_address?: string
          created_at?: string
          decimals?: number | null
          id?: string
          name?: string
          network?: string
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          account_number: string | null
          bank_code: string | null
          bank_name: string | null
          created_at: string | null
          decoder_number: string | null
          id: string
          meter_number: string | null
          phone_number: string | null
          plan_code: string | null
          provider: string | null
          recipient_id: string | null
          recipient_identifier: string | null
          recipient_name: string | null
          service_code: string | null
          type: string
          user_id: string
        }
        Insert: {
          account_number?: string | null
          bank_code?: string | null
          bank_name?: string | null
          created_at?: string | null
          decoder_number?: string | null
          id?: string
          meter_number?: string | null
          phone_number?: string | null
          plan_code?: string | null
          provider?: string | null
          recipient_id?: string | null
          recipient_identifier?: string | null
          recipient_name?: string | null
          service_code?: string | null
          type: string
          user_id: string
        }
        Update: {
          account_number?: string | null
          bank_code?: string | null
          bank_name?: string | null
          created_at?: string | null
          decoder_number?: string | null
          id?: string
          meter_number?: string | null
          phone_number?: string | null
          plan_code?: string | null
          provider?: string | null
          recipient_id?: string | null
          recipient_identifier?: string | null
          recipient_name?: string | null
          service_code?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      fees: {
        Row: {
          amount: number
          collected_at: string | null
          id: string
          service_type: string
          transaction_id: string
          transfer_reference: string | null
          transferred: boolean | null
          transferred_at: string | null
          userid: string | null
        }
        Insert: {
          amount: number
          collected_at?: string | null
          id?: string
          service_type: string
          transaction_id: string
          transfer_reference?: string | null
          transferred?: boolean | null
          transferred_at?: string | null
          userid?: string | null
        }
        Update: {
          amount?: number
          collected_at?: string | null
          id?: string
          service_type?: string
          transaction_id?: string
          transfer_reference?: string | null
          transferred?: boolean | null
          transferred_at?: string | null
          userid?: string | null
        }
        Relationships: []
      }
      financial_goals: {
        Row: {
          category: string
          color: string | null
          created_at: string | null
          current_amount: number
          deadline: string | null
          description: string | null
          id: string
          status: string
          target_amount: number
          title: string
          user_id: string
        }
        Insert: {
          category: string
          color?: string | null
          created_at?: string | null
          current_amount?: number
          deadline?: string | null
          description?: string | null
          id?: string
          status?: string
          target_amount: number
          title: string
          user_id: string
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string | null
          current_amount?: number
          deadline?: string | null
          description?: string | null
          id?: string
          status?: string
          target_amount?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      kyc_verifications: {
        Row: {
          created_at: string
          document_number: string | null
          document_type: string | null
          id: string
          status: string
          updated_at: string
          user_id: string
          verification_data: Json | null
          verification_type: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          document_type?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id: string
          verification_data?: Json | null
          verification_type?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          document_number?: string | null
          document_type?: string | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
          verification_data?: Json | null
          verification_type?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      migration: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: never
          name?: string | null
        }
        Update: {
          id?: never
          name?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      point_redemptions: {
        Row: {
          created_at: string
          id: string
          points_redeemed: number
          transaction_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_redeemed: number
          transaction_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_redeemed?: number
          transaction_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auto_save_percentage: number | null
          avatar_url: string | null
          balance: number | null
          biometric_enabled: boolean | null
          bvn: string | null
          card_waitlist: boolean | null
          created_at: string | null
          encrypted_wallet_data: string | null
          full_name: string | null
          id: string
          is_bank_verified: boolean | null
          is_verified: boolean | null
          login_pin: string | null
          login_pin_enabled: boolean | null
          mirackle_id: string | null
          nin_number: string | null
          payment_pin: string | null
          phone_number: string | null
          points: number | null
          preferred_currency: string | null
          referral_count: number | null
          referred_by: string | null
          transaction_count: number | null
          updated_at: string | null
          username: string | null
          vault_balance: number | null
          waitlist_email: string | null
          web3_mnemonic_created: boolean | null
          web3_pin: string | null
          web3_wallet_address: string | null
          web3_wallet_initialized: boolean | null
        }
        Insert: {
          auto_save_percentage?: number | null
          avatar_url?: string | null
          balance?: number | null
          biometric_enabled?: boolean | null
          bvn?: string | null
          card_waitlist?: boolean | null
          created_at?: string | null
          encrypted_wallet_data?: string | null
          full_name?: string | null
          id: string
          is_bank_verified?: boolean | null
          is_verified?: boolean | null
          login_pin?: string | null
          login_pin_enabled?: boolean | null
          mirackle_id?: string | null
          nin_number?: string | null
          payment_pin?: string | null
          phone_number?: string | null
          points?: number | null
          preferred_currency?: string | null
          referral_count?: number | null
          referred_by?: string | null
          transaction_count?: number | null
          updated_at?: string | null
          username?: string | null
          vault_balance?: number | null
          waitlist_email?: string | null
          web3_mnemonic_created?: boolean | null
          web3_pin?: string | null
          web3_wallet_address?: string | null
          web3_wallet_initialized?: boolean | null
        }
        Update: {
          auto_save_percentage?: number | null
          avatar_url?: string | null
          balance?: number | null
          biometric_enabled?: boolean | null
          bvn?: string | null
          card_waitlist?: boolean | null
          created_at?: string | null
          encrypted_wallet_data?: string | null
          full_name?: string | null
          id?: string
          is_bank_verified?: boolean | null
          is_verified?: boolean | null
          login_pin?: string | null
          login_pin_enabled?: boolean | null
          mirackle_id?: string | null
          nin_number?: string | null
          payment_pin?: string | null
          phone_number?: string | null
          points?: number | null
          preferred_currency?: string | null
          referral_count?: number | null
          referred_by?: string | null
          transaction_count?: number | null
          updated_at?: string | null
          username?: string | null
          vault_balance?: number | null
          waitlist_email?: string | null
          web3_mnemonic_created?: boolean | null
          web3_pin?: string | null
          web3_wallet_address?: string | null
          web3_wallet_initialized?: boolean | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          points_awarded: number
          referred_id: string
          referrer_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_awarded?: number
          referred_id: string
          referrer_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          points_awarded?: number
          referred_id?: string
          referrer_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          amount: number
          created_at: string | null
          expires_at: string
          id: string
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          expires_at: string
          id?: string
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          expires_at?: string
          id?: string
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          fee: number | null
          id: string
          metadata: Json | null
          reference: string
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          fee?: number | null
          id: string
          metadata?: Json | null
          reference: string
          status: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          fee?: number | null
          id?: string
          metadata?: Json | null
          reference?: string
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          created_at: string
          document_type: string
          document_url: string | null
          file_name: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          status: string
          uploaded_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          document_url?: string | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          status?: string
          uploaded_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          status?: string
          uploaded_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      user_limits: {
        Row: {
          created_at: string
          current_daily_received: number | null
          current_daily_sent: number | null
          current_monthly_received: number | null
          current_monthly_sent: number | null
          daily_receive_limit: number | null
          daily_send_limit: number | null
          id: string
          last_reset_date: string | null
          monthly_receive_limit: number | null
          monthly_send_limit: number | null
          single_transaction_limit: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_daily_received?: number | null
          current_daily_sent?: number | null
          current_monthly_received?: number | null
          current_monthly_sent?: number | null
          daily_receive_limit?: number | null
          daily_send_limit?: number | null
          id?: string
          last_reset_date?: string | null
          monthly_receive_limit?: number | null
          monthly_send_limit?: number | null
          single_transaction_limit?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_daily_received?: number | null
          current_daily_sent?: number | null
          current_monthly_received?: number | null
          current_monthly_sent?: number | null
          daily_receive_limit?: number | null
          daily_send_limit?: number | null
          id?: string
          last_reset_date?: string | null
          monthly_receive_limit?: number | null
          monthly_send_limit?: number | null
          single_transaction_limit?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          language_preference: string | null
          notification_preferences: Json | null
          privacy_settings: Json | null
          security_settings: Json | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language_preference?: string | null
          notification_preferences?: Json | null
          privacy_settings?: Json | null
          security_settings?: Json | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language_preference?: string | null
          notification_preferences?: Json | null
          privacy_settings?: Json | null
          security_settings?: Json | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      web3_transactions: {
        Row: {
          created_at: string
          from_address: string
          gas_price: string | null
          gas_used: string | null
          id: string
          metadata: Json | null
          network: string
          status: string
          timestamp: string
          to_address: string
          tx_hash: string
          type: string
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          from_address: string
          gas_price?: string | null
          gas_used?: string | null
          id?: string
          metadata?: Json | null
          network: string
          status: string
          timestamp?: string
          to_address: string
          tx_hash: string
          type: string
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          from_address?: string
          gas_price?: string | null
          gas_used?: string | null
          id?: string
          metadata?: Json | null
          network?: string
          status?: string
          timestamp?: string
          to_address?: string
          tx_hash?: string
          type?: string
          user_id?: string
          value?: string
        }
        Relationships: []
      }
      webauthn_credentials: {
        Row: {
          counter: number
          created_at: string | null
          credential_id: string
          id: string
          last_used_at: string | null
          public_key: string
          user_id: string
        }
        Insert: {
          counter?: number
          created_at?: string | null
          credential_id: string
          id?: string
          last_used_at?: string | null
          public_key: string
          user_id: string
        }
        Update: {
          counter?: number
          created_at?: string | null
          credential_id?: string
          id?: string
          last_used_at?: string | null
          public_key?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_admin: {
        Args: { p_email: string; p_pin_hash: string }
        Returns: {
          id: string
          email: string
          full_name: string
          department: Database["public"]["Enums"]["admin_role"]
          session_token: string
        }[]
      }
      decrement_balance: {
        Args: { user_id: string; amount_to_subtract: number }
        Returns: number
      }
      generate_mirackle_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment_balance: {
        Args: { user_id: string; amount_to_add: number }
        Returns: number
      }
      increment_referral_count: {
        Args: { profile_id: string }
        Returns: number
      }
      log_admin_action: {
        Args: {
          p_admin_user_id: string
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_old_values?: Json
          p_new_values?: Json
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: string
      }
      process_user_transfer: {
        Args: {
          sender_id: string
          recipient_id: string
          transfer_amount: number
          transfer_description?: string
        }
        Returns: Json
      }
      verify_admin_permission: {
        Args: { p_admin_user_id: string; p_resource: string; p_action: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role:
        | "super_admin"
        | "compliance"
        | "customer_support"
        | "risk_fraud"
        | "operations"
        | "marketing"
        | "technical_support"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: [
        "super_admin",
        "compliance",
        "customer_support",
        "risk_fraud",
        "operations",
        "marketing",
        "technical_support",
      ],
    },
  },
} as const

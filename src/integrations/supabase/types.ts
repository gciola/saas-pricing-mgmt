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
      dealhist: {
        Row: {
          comissionvalue: number | null
          created_at: string
          deallink: string | null
          descgroup: string | null
          descoffer: string | null
          franchise: string | null
          hostingcost: number | null
          iddeal: string
          idgroup: string | null
          impcost: number | null
          offercode: string
          price: number | null
          qty: number | null
          revenue: number | null
          supportcost: number | null
          taxes: number | null
          unitprice: number | null
          updated_at: string
          wacost: number | null
        }
        Insert: {
          comissionvalue?: number | null
          created_at?: string
          deallink?: string | null
          descgroup?: string | null
          descoffer?: string | null
          franchise?: string | null
          hostingcost?: number | null
          iddeal: string
          idgroup?: string | null
          impcost?: number | null
          offercode: string
          price?: number | null
          qty?: number | null
          revenue?: number | null
          supportcost?: number | null
          taxes?: number | null
          unitprice?: number | null
          updated_at?: string
          wacost?: number | null
        }
        Update: {
          comissionvalue?: number | null
          created_at?: string
          deallink?: string | null
          descgroup?: string | null
          descoffer?: string | null
          franchise?: string | null
          hostingcost?: number | null
          iddeal?: string
          idgroup?: string | null
          impcost?: number | null
          offercode?: string
          price?: number | null
          qty?: number | null
          revenue?: number | null
          supportcost?: number | null
          taxes?: number | null
          unitprice?: number | null
          updated_at?: string
          wacost?: number | null
        }
        Relationships: []
      }
      franchise: {
        Row: {
          franchisetype: string | null
          frlabel: string
          idfranchise: number
          limits: number | null
        }
        Insert: {
          franchisetype?: string | null
          frlabel: string
          idfranchise?: number
          limits?: number | null
        }
        Update: {
          franchisetype?: string | null
          frlabel?: string
          idfranchise?: number
          limits?: number | null
        }
        Relationships: []
      }
      hostingcosts: {
        Row: {
          hcost: number | null
          idproduct: number
        }
        Insert: {
          hcost?: number | null
          idproduct: number
        }
        Update: {
          hcost?: number | null
          idproduct?: number
        }
        Relationships: [
          {
            foreignKeyName: "hostingcosts_idproduct_fkey"
            columns: ["idproduct"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["idproduct"]
          },
        ]
      }
      offergroup: {
        Row: {
          descgroup: string
          grouptype: string
          idgroup: string
        }
        Insert: {
          descgroup: string
          grouptype: string
          idgroup: string
        }
        Update: {
          descgroup?: string
          grouptype?: string
          idgroup?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          descoffer: string
          idfranchise: number | null
          idgroup: string
          idoffer: string
          idproduct: number | null
          parceltype: string
          payer: string
          quantity1: boolean
        }
        Insert: {
          descoffer: string
          idfranchise?: number | null
          idgroup: string
          idoffer: string
          idproduct?: number | null
          parceltype?: string
          payer?: string
          quantity1?: boolean
        }
        Update: {
          descoffer?: string
          idfranchise?: number | null
          idgroup?: string
          idoffer?: string
          idproduct?: number | null
          parceltype?: string
          payer?: string
          quantity1?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "offers_idfranchise_fkey"
            columns: ["idfranchise"]
            isOneToOne: false
            referencedRelation: "franchise"
            referencedColumns: ["idfranchise"]
          },
          {
            foreignKeyName: "offers_idgroup_fkey"
            columns: ["idgroup"]
            isOneToOne: false
            referencedRelation: "offergroup"
            referencedColumns: ["idgroup"]
          },
          {
            foreignKeyName: "offers_idproduct_fkey"
            columns: ["idproduct"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["idproduct"]
          },
        ]
      }
      pricing: {
        Row: {
          baseprice: number
          current: boolean | null
          idoffer: string
          version: number
        }
        Insert: {
          baseprice: number
          current?: boolean | null
          idoffer: string
          version?: number
        }
        Update: {
          baseprice?: number
          current?: boolean | null
          idoffer?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "baseprice_idoffer_fkey"
            columns: ["idoffer"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["idoffer"]
          },
        ]
      }
      products: {
        Row: {
          codproduct: string | null
          combo: boolean | null
          description: string | null
          franchisetype: string | null
          idproduct: number
          modules: Json | null
        }
        Insert: {
          codproduct?: string | null
          combo?: boolean | null
          description?: string | null
          franchisetype?: string | null
          idproduct?: number
          modules?: Json | null
        }
        Update: {
          codproduct?: string | null
          combo?: boolean | null
          description?: string | null
          franchisetype?: string | null
          idproduct?: number
          modules?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      resourcehours: {
        Row: {
          hours: number
          idoffer: string
          idresource: string
          monthly: boolean
        }
        Insert: {
          hours: number
          idoffer: string
          idresource: string
          monthly: boolean
        }
        Update: {
          hours?: number
          idoffer?: string
          idresource?: string
          monthly?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "resourcehours_idoffer_fkey"
            columns: ["idoffer"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["idoffer"]
          },
          {
            foreignKeyName: "resourcehours_idresource_fkey"
            columns: ["idresource"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["idresource"]
          },
        ]
      }
      resources: {
        Row: {
          description: string | null
          hourcost: number | null
          idresource: string
          resourcetype: string | null
        }
        Insert: {
          description?: string | null
          hourcost?: number | null
          idresource: string
          resourcetype?: string | null
        }
        Update: {
          description?: string | null
          hourcost?: number | null
          idresource?: string
          resourcetype?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          parameter: string
          value: string | null
        }
        Insert: {
          parameter: string
          value?: string | null
        }
        Update: {
          parameter?: string
          value?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      getbaseprice: {
        Args: {
          apidescproduct: string
          contractdur: number
          apifranchise: string
          hubqty: number
          partnerqty: number
        }
        Returns: Json
      }
      getbasepricedeal: {
        Args: {
          dealnr: string
          apidescproduct: string
          contractdur: number
          apifranchise: string
          hubqty: number
          partnerqty: number
        }
        Returns: Json
      }
      getmarginwithpricechange: {
        Args: {
          contractdur: number
          codofertas: string[]
          custostotais: number[]
          precos: number[]
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

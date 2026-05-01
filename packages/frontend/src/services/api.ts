import axios from "axios";
import type { ApiResponse, Node, NodeWithChildren } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
});

export const fetchTree = async (): Promise<ApiResponse<NodeWithChildren[]>> => {
  const response = await api.get<ApiResponse<NodeWithChildren[]>>("/nodes/tree");
  return response.data;
};

export const fetchChildren = async (id: string): Promise<ApiResponse<Node[]>> => {
  const response = await api.get<ApiResponse<Node[]>>(`/nodes/${id}/children`);
  return response.data;
};

export const searchNodes = async (query: string): Promise<ApiResponse<Node[]>> => {
  const response = await api.get<ApiResponse<Node[]>>(`/nodes/search?q=${query}`);
  return response.data;
};

import { db } from "./config";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  DocumentData
} from "firebase/firestore";

// Helper to strictly enforce tenant_id in all operations
export const requireTenant = (tenantId: string | null) => {
  if (!tenantId) {
    throw new Error("Acesso negado: tenant_id é obrigatório para esta operação.");
  }
};

// CREATE
export const createTenantDoc = async (
  collectionName: string, 
  docId: string, 
  data: DocumentData, 
  tenantId: string | null
) => {
  requireTenant(tenantId);
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, { ...data, tenant_id: tenantId, createdAt: new Date() });
  return docRef;
};

// READ ALL (for tenant)
export const getTenantDocs = async (collectionName: string, tenantId: string | null) => {
  requireTenant(tenantId);
  const q = query(collection(db, collectionName), where("tenant_id", "==", tenantId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// READ ONE (for tenant)
export const getTenantDoc = async (collectionName: string, docId: string, tenantId: string | null) => {
  requireTenant(tenantId);
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists() && docSnap.data().tenant_id === tenantId) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Documento não encontrado ou não pertence a este tenant.");
  }
};

// UPDATE
export const updateTenantDoc = async (
  collectionName: string, 
  docId: string, 
  data: Partial<DocumentData>, 
  tenantId: string | null
) => {
  requireTenant(tenantId);
  // Verify ownership before updating
  await getTenantDoc(collectionName, docId, tenantId);
  
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, { ...data, updatedAt: new Date() });
};

// DELETE
export const deleteTenantDoc = async (collectionName: string, docId: string, tenantId: string | null) => {
  requireTenant(tenantId);
  // Verify ownership before deleting
  await getTenantDoc(collectionName, docId, tenantId);
  
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

// RBAC Helper
export const hasPermission = (userRole: string | null, requiredRole: string | string[]) => {
  if (!userRole) return false;
  if (userRole === "dono") return true; // Owner has all permissions
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
};

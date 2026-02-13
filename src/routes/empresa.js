// routes/empresa.js
import express from "express";
import { supabaseAdmin } from "../supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/crear", requireAuth, async (req, res) => {
    try {
        console.log("📩 BODY:", req.body);
        console.log("👤 ADMIN UID:", req.user.id);
        const {
            empresa_nombre,
            empresa_tipo,
            usuario_nombre,
            usuario_email,
            usuario_tipo,
            carpeta_nombre,
        } = req.body;
        
        /* ===Crear empresa=== */
        const { data: empresa, error: empresaError } =
            await supabaseAdmin
                .from("empresa")
                .insert({
                nombre: empresa_nombre,
                tipo: empresa_tipo ?? "empresa",
                })
                .select()
                .single();
        if (empresaError) throw empresaError;

        /* ===Invitar usuario (crea auth automáticamente)=== */
        const { data: inviteData, error: inviteError } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(
            usuario_email,
            {
            redirectTo: "http://localhost:5173/reset-password",
            }
        );
        if (inviteError) throw inviteError;

        const authUid = inviteData.user.id;

        /* ===Crear usuario app=== */
        const { data: usuario, error: usuarioError } =
            await supabaseAdmin
            .from("usuario")
            .insert({
                id_usuario: authUid,              // 🔑 CLAVE
                nombre: usuario_nombre,
                tipo: usuario_tipo,               // 'admin' | 'user'
                id_empresa_fk: empresa.id_empresa,
                })
            .select()
            .single();

        if (usuarioError) throw usuarioError;


    console.log("📧 Invitación enviada correctamente");




        /* ======================
            4️⃣ Crear carpeta raíz
        ====================== */
        const { error: carpetaError } =
            await supabaseAdmin.from("carpeta").insert({
                nombre: carpeta_nombre,
                padre: null,
                id_usuario_fk: usuario.id_usuario,
            });

        if (carpetaError) throw carpetaError;

        /* ======================
            5️⃣ Respuesta final
        ====================== */
        res.json({
            success: true,
            empresa,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                tipo: usuario.tipo,
            },
        });

    } catch (err) {
        console.error("❌ API ERROR:", err);
        res.status(500).json({
            success: false,
            error: err.message,
            });
        }
    });



router.get("/ruta/:id", requireAuth, async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabaseAdmin.rpc("obtener_ruta_carpeta", {
        carpeta_id: Number(id),
        });

        if (error) throw error;

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;

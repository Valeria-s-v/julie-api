// Convierte en admin a un usuario ya registrado.
// Uso: npm run make-admin -- email@ejemplo.com
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/userModel.js';

const email = process.argv[2]?.toLowerCase().trim();

if (!email) {
    console.error('Falta el email. Uso: npm run make-admin -- email@ejemplo.com');
    process.exit(1);
}

try {
    await mongoose.connect(process.env.MONGODB_URI);
    const usuario = await User.findOneAndUpdate(
        { email },
        { role: 'admin' },
        { returnDocument: 'after' }
    );
    if (!usuario) {
        console.error(`No existe un usuario con el email ${email}. Registralo primero.`);
        process.exitCode = 1;
    } else {
        console.log(`Listo: ${usuario.name} (${usuario.email}) ahora es admin.`);
    }
} catch (error) {
    console.error('Error:', error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}


import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtén el token del localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const token = currentUser?.token;

  // Clona la solicitud y agrega el encabezado de autorización si existe el token
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  // Pasa la solicitud al siguiente manejador
  return next(authReq);
};

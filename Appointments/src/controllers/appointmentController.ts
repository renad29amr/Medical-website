import { Request, Response } from "express";
import appointmentService from "../services/appointmentService";

class AppointmentController {
  

  async createAppointment(req: Request, res: Response) {
    try {
      const patientId = req.user.id;

      const {
        doctor,
        appointmentDate,
        timeSlot,
        notes,
      } = req.body;

      const appointment =
        await appointmentService.createAppointment({
          patient: patientId,
          doctor,
          appointmentDate: new Date(appointmentDate),
          timeSlot,
          notes,
        });

      return res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        appointment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAppointments(req: Request, res: Response) {
    try {
      const patientId = req.user.id;

      const {
        status,
        date,
      } = req.query;

      const appointments =
        await appointmentService.getPatientAppointments(
          patientId,
          {
            status: status as string,
            date: date as string,
          }
        );

      return res.status(200).json({
        success: true,
        count: appointments.length,
        appointments,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }



  async getDoctorAppointments(req: Request, res: Response) {
    try {
      const doctorId = req.user.id;

      const {
        status,
        date,
      } = req.query;

      const appointments =
        await appointmentService.getDoctorAppointments(
          doctorId,
          {
            status: status as string,
            date: date as string,
          }
        );

      return res.status(200).json({
        success: true,
        count: appointments.length,
        appointments,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }



  async cancelAppointment(req: Request, res: Response) {
    try {
      const appointmentId = req.params.id;
      const userId = req.user.id;
      const role = req.user.role;

      const appointment =
        await appointmentService.cancelAppointment(
          appointmentId,
          userId,
          role
        );

      return res.status(200).json({
        success: true,
        message: "Appointment cancelled successfully",
        appointment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }


  async confirmAppointment(req: Request, res: Response) {
    try {
      const appointmentId = req.params.id;
      const doctorId = req.user.id;

      const appointment =
        await appointmentService.confirmAppointment(
          appointmentId,
          doctorId
        );

      return res.status(200).json({
        success: true,
        message: "Appointment confirmed successfully",
        appointment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }




  async completeAppointment(req: Request, res: Response) {
    try {
      const appointmentId = req.params.id;
      const doctorId = req.user.id;

      const appointment =
        await appointmentService.completeAppointment(
          appointmentId,
          doctorId
        );

      return res.status(200).json({
        success: true,
        message: "Appointment completed successfully",
        appointment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new AppointmentController();
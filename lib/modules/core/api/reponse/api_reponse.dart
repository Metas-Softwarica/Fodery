import 'package:equatable/equatable.dart';

class ApiResponse<T> extends Equatable {
  final T data;
  final String message;
  final Object? errors;
  const ApiResponse({required this.data, required this.message, this.errors});

  @override
  List<Object?> get props => [data, message, errors];
}

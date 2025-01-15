<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', '0'); // Do not display errors to the user
ini_set('log_errors', '1'); // Enable error logging
ini_set('error_log', './forms/errors.log'); // Set error log file path

require_once __DIR__ . '/vendor/autoload.php';

use Mpdf\Mpdf;
use setasign\Fpdi\Fpdi;

// Function to log errors
function log_error($error_message) {
    error_log($error_message);
}

// More robust sanitization function
function sanitize_input($data, $type = 'string') {
    if (is_array($data)) {
        return array_map(function($item) use ($type) {
            return sanitize_input($item, $type);
        }, $data);
    }

    $data = trim($data);

    switch ($type) {
        case 'string':
            return filter_var($data, FILTER_SANITIZE_STRING);
        case 'email':
            $sanitized = filter_var($data, FILTER_SANITIZE_EMAIL);
            return filter_var($sanitized, FILTER_VALIDATE_EMAIL) ? $sanitized : false;
        case 'date':
            return filter_var($data, FILTER_SANITIZE_STRING); // Further validation would be needed for actual date checking
        case 'number':
            return filter_var($data, FILTER_SANITIZE_NUMBER_INT);
        case 'tel':
            return preg_replace('/[^0-9-]/', '', $data); // Remove everything except numbers and hyphens
        default:
            return filter_var($data, FILTER_SANITIZE_STRING);
    }
}

// Function to validate form data
function validate_form($post_data) {
    $errors = [];

    if (!isset($post_data['salutation']) || strlen($post_data['salutation']) == 0) {
        $errors[] = "Salutation is required.";
    }
    // Add more validations here for each field...

    if (!empty($errors)) {
        return $errors;
    }
    return true;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        $validation = validate_form($_POST);
        
        if ($validation !== true) {
            // Log validation errors
            log_error("Validation errors: " . implode(", ", $validation));
            // Handle validation errors, e.g., return them back to the form
            echo json_encode(['errors' => $validation]);
            exit;
        }

        // Start output buffering to capture HTML content
        ob_start();

        // Generate HTML for PDF
        echo '<h1>MEMBERSHIP E-REGISTRATION</h1>';

        // Personal Details
        echo '<h2>Personal Details</h2>';
        echo '<p><strong>Salutation:</strong> ' . sanitize_input($_POST['salutation']) . '</p>';
        echo '<p><strong>First Name:</strong> ' . sanitize_input($_POST['fname']) . '</p>';
        echo '<p><strong>Middle Name:</strong> ' . sanitize_input($_POST['mname'], 'string') ?: 'N/A' . '</p>';
        echo '<p><strong>Last Name:</strong> ' . sanitize_input($_POST['lname']) . '</p>';
        echo '<p><strong>Date of Birth:</strong> ' . sanitize_input($_POST['Date'], 'date') . '</p>';
        echo '<p><strong>Identity Document No:</strong> ' . sanitize_input($_POST['Date'], 'string') . '</p>';
        echo '<p><strong>Email:</strong> ' . sanitize_input($_POST['email'], 'email') . '</p>';
        echo '<p><strong>Phone Number:</strong> ' . sanitize_input($_POST['phone'], 'tel') . '</p>';
        echo '<p><strong>Other Phone No:</strong> ' . sanitize_input($_POST['otherphone'], 'tel') ?: 'N/A' . '</p>';
        echo '<p><strong>Gender:</strong> ' . sanitize_input($_POST['gender']) . '</p>';
        echo '<p><strong>Marital Status:</strong> ' . sanitize_input($_POST['marital']) . '</p>';

        // Employment Details
        echo '<h2>Employment Details</h2>';
        $employmentType = sanitize_input($_POST['employmentType']);
        echo '<p><strong>Type of Employment:</strong> ' . $employmentType . '</p>';
        
        // ... (Continue with employment details as in previous script)

        // Next of Kin Details
        echo '<h2>Next of Kin Details</h2>';
        if (!empty($_POST['kinName'])) {
            $kinNames = sanitize_input($_POST['kinName'], 'string');
            foreach ($kinNames as $index => $name) {
                // ... (Continue with next of kin details)
            }
        }

        // Referee Details
        echo '<h2>Referee Details</h2>';
        echo '<p><strong>Name of Referee:</strong> ' . sanitize_input($_POST['referee']) . '</p>';

        // Capture the output buffer content
        $html = ob_get_clean();

        // Use FPDI to add content or images to an existing PDF template if needed
        $pdf = new Fpdi();
        $pageCount = $pdf->setSourceFile('path/to/your/template.pdf');
        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $templateId = $pdf->importPage($pageNo);
            $size = $pdf->getTemplateSize($templateId);
            $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
            $pdf->useTemplate($templateId);

            if ($pageNo == 1) { // Assuming HTML content goes on the first page
                $mpdf = new Mpdf();
                $mpdf->WriteHTML($html);
                $mpdf->Output('temphtml.pdf', 'F'); // Save HTML as temporary PDF

                $htmlPdf = new Fpdi();
                $htmlPdf->setSourceFile('temphtml.pdf');
                $htmlTemplateId = $htmlPdf->importPage(1);
                $htmlSize = $htmlPdf->getTemplateSize($htmlTemplateId);
                $pdf->useTemplate($htmlTemplateId, 0, 0, $htmlSize['width'], $htmlSize['height']);
            }
        }

        // Output PDF to browser
        $pdf->Output('membership_registration.pdf', 'D');

        // Clean up temporary file if necessary
        if (file_exists('temphtml.pdf')) {
            unlink('temphtml.pdf');
        }
    } catch (Exception $e) {
        // Log exceptions
        log_error("Exception occurred: " . $e->getMessage());
        echo "An error occurred while processing your request. Please try again later.";
    }
} else {
    // If the form is not submitted via POST, show the HTML form here or redirect back
    echo "Form not submitted.";
}
?>